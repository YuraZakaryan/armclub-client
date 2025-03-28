import type { Session } from 'next-auth';
import type { InferType } from 'yup';
import type { RegistrationSchema } from '~/components/auth/types';
import type { contactUsSchema, updatePasswordSchema, updateProfileSchema, userSchema } from '~/schema/schema';
import type { TActivationMode, TResponse, TReturnItem } from '~/types';
import type { FetchError } from '~/types/error';
import type { TAuthMode, TFetchUsersBody, TOtpWithEmail, TUser, TUserState } from '~/types/user';

type UserSchema = InferType<ReturnType<typeof userSchema>>;
type ProfileSchema = InferType<ReturnType<typeof updateProfileSchema>>;
type PasswordSchema = InferType<ReturnType<typeof updatePasswordSchema>>;
type ContactUsSchema = InferType<ReturnType<typeof contactUsSchema>>;

export const useUserStore = defineStore('user', () => {
  const state = reactive<TUserState>({
    authMode: 'LOGIN',
    activationMode: 'REQUEST_ACTIVATION',
    session: null,
    user: null,
    currentUser: null,
    isRequestLoading: false,
    isResendLoading: false,
    isPasswordRequestLoading: false,
    isActivationRequestLoading: false,
    resetPassword: {
      email: '',
      otp: '',
    },
    activationProfile: {
      email: '',
      otp: '',
    },
    users: {
      items: [],
      total_items: 0,
    },
  });

  const setAuthMode = (mode: TAuthMode) => {
    state.authMode = mode;
  };

  const setActivationMode = (mode: TActivationMode) => {
    state.activationMode = mode;
  };

  const updateSession = (session: Session | null) => {
    state.session = session;
  };

  const setResetPassword = ({ email, otp }: TOtpWithEmail) => {
    state.resetPassword = {
      ...state.resetPassword,
      email: email || state.resetPassword.email,
      otp: otp || state.resetPassword.otp,
    };
  };

  const setActivationAccount = ({ email, otp }: TOtpWithEmail) => {
    state.activationProfile = {
      ...state.activationProfile,
      email: email || state.activationProfile.email,
      otp: otp || state.activationProfile.otp,
    };
  };

  const { $api } = useNuxtApp();

  const fetchSession = async () => {
    const { data } = await useFetch<Session | null>('/api/protected');

    state.session = data.value;
  };

  const fetchUsers = async ({ search, page, limit, sort, order, userBanStatuses }: TFetchUsersBody) => {
    try {
      const response = await $api<TReturnItem<TUser[]>>('user/all', {
        method: 'GET',
        params: {
          name: search || '',
          limit: limit || 0,
          skip: page && limit ? (page - 1) * limit : 0,
          sort,
          order,
          ...Object.fromEntries(
            Object.entries({
              userBanStatuses: userBanStatuses,
            })
              .filter(([_, value]) => value && value.length > 0)
              .map(([key, value]) => [key, value?.join(',')]),
          ),
        },
      });

      state.users = response;
      return response;
    } catch (err) {
      console.log(err, 'ERROR');
      return [];
    }
  };

  const fetchUserById = async (propertyId: string): Promise<TUser | null> => {
    try {
      const response = await $api<TUser>(`http://localhost:5000/api/user/${propertyId}`);

      state.currentUser = response;

      return response;
    } catch (err) {
      console.log(err, 'ERROR');
      return null;
    }
  };

  const fetchProfile = async (): Promise<TUser | null> => {
    try {
      return await $api<TUser>(`user`);
    } catch (err) {
      console.log(err, 'ERROR');
      return null;
    }
  };

  const registration = async (body: RegistrationSchema) => {
    state.isRequestLoading = true;
    try {
      const { message } = await $api<TResponse>('auth/registration', {
        method: 'POST',
        body,
      });

      return {
        success: true,
        status: 201,
        message,
      };
    } catch (error) {
      const fetchError = error as FetchError;

      return {
        success: false,
        status: fetchError?.response?.status || 500,
        message: fetchError?.response?._data.message || 'Unknown error occurred',
      };
    } finally {
      state.isRequestLoading = false;
    }
  };

  const update = async (body: UserSchema & { id: string }) => {
    const { id, role } = body;

    try {
      state.isRequestLoading = true;
      await $api<TUser>(`user/update/${id}`, {
        method: 'PATCH',
        body: {
          ...body,
          role: role.value ? role.value?.toUpperCase() : 'USER',
        },
      });

      return true;
    } catch (error) {
      console.error('Error while updating:', error);
      return false;
    } finally {
      state.isRequestLoading = false;
    }
  };

  const updateProfile = async (body: ProfileSchema) => {
    try {
      state.isRequestLoading = true;
      await $api<TUser>(`user/update/current`, {
        method: 'PATCH',
        body,
      });

      return true;
    } catch (error) {
      console.error('Error while updating:', error);
      return false;
    } finally {
      state.isRequestLoading = false;
    }
  };

  const updatePassword = async (body: PasswordSchema) => {
    state.isPasswordRequestLoading = true;
    try {
      return await $api<TResponse>(`user/update/password`, {
        method: 'PATCH',
        body,
      });
    } catch (err) {
      const error = err as FetchError;
      console.error('Error while updating:', error);
      return false;
    } finally {
      state.isPasswordRequestLoading = false;
    }
  };

  const createNewPassword = async (body: PasswordSchema) => {
    state.isPasswordRequestLoading = true;
    try {
      return await $api<TResponse>(`user/set/password`, {
        method: 'PATCH',
        body,
      });
    } catch (err) {
      const error = err as FetchError;
      console.error('Error while updating:', error);
      return false;
    } finally {
      state.isPasswordRequestLoading = false;
    }
  };

  const deleteUser = async (id: string) => {
    state.isRequestLoading = true;
    try {
      await $api(`user/delete/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error while deleting user:', error);
      return false;
    } finally {
      state.isRequestLoading = false;
    }
  };

  const requestPasswordReset = async (email: string, resend: boolean = false) => {
    if (resend) {
      state.isResendLoading = true;
    } else {
      state.isPasswordRequestLoading = true;
    }

    try {
      await $api<TUser>('user/reset-password/send', {
        method: 'POST',
        body: { email },
      });

      return true;
    } catch (error) {
      console.error('Error while updating:', error);
      return false;
    } finally {
      if (resend) {
        state.isResendLoading = false;
      } else {
        state.isPasswordRequestLoading = false;
      }
    }
  };

  const requestAccountActivation = async (email: string, resend: boolean = false) => {
    if (resend) {
      state.isResendLoading = true;
    } else {
      state.isActivationRequestLoading = true;
    }

    try {
      await $api<TUser>('user/account-activation/send', {
        method: 'POST',
        body: { email },
      });

      return true;
    } catch (error) {
      console.error('Error while updating:', error);
      return false;
    } finally {
      if (resend) {
        state.isResendLoading = false;
      } else {
        state.isActivationRequestLoading = false;
      }
    }
  };

  const verifyPasswordReset = async (otp: string) => {
    state.isRequestLoading = true;
    try {
      await $api<TUser>('user/reset-password/confirm', {
        method: 'PUT',
        body: { email: state.resetPassword.email, otp: String(otp) },
      });

      return true;
    } catch (error) {
      console.error('Error while updating:', error);
      return false;
    } finally {
      state.isRequestLoading = false;
    }
  };

  const confirmAccountActivation = async (otp: string) => {
    state.isActivationRequestLoading = true;
    try {
      await $api<TUser>('user/account-activation/confirm', {
        method: 'PUT',
        body: { email: state.activationProfile.email, otp: String(otp) },
      });

      return true;
    } catch (error) {
      console.error('Error while updating:', error);
      return false;
    } finally {
      state.isActivationRequestLoading = false;
    }
  };

  const resetPassword = async (newPassword: string) => {
    try {
      state.isRequestLoading = true;
      await $api<TUser>('user/reset-password', {
        method: 'PUT',
        body: {
          email: state.resetPassword.email,
          otp: String(state.resetPassword.otp),
          newPassword,
        },
      });

      return true;
    } catch (error) {
      console.error('Error while updating:', error);
      return false;
    } finally {
      state.isRequestLoading = false;
    }
  };

  const contactMessage = async (body: ContactUsSchema) => {
    try {
      state.isRequestLoading = true;
      await $api<TUser>('user/contact-us', {
        method: 'POST',
        body,
      });

      return true;
    } catch (error) {
      console.error('Error while updating:', error);
      return false;
    } finally {
      state.isRequestLoading = false;
    }
  };

  return {
    state,
    setAuthMode,
    setActivationMode,
    updateSession,
    fetchSession,
    fetchUserById,
    update,
    updateProfile,
    updatePassword,
    createNewPassword,
    deleteUser,
    fetchUsers,
    fetchProfile,
    registration,
    requestPasswordReset,
    requestAccountActivation,
    setResetPassword,
    setActivationAccount,
    verifyPasswordReset,
    confirmAccountActivation,
    resetPassword,
    contactMessage,
  };
});
