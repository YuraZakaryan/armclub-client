import type { TClub, TClubSchema, TClubState, TFetchClubsBody, TGeocodeResponse, TReturnItem } from '~/types';
import { defineStore } from 'pinia';

export const useClubStore = defineStore('club', () => {
  const config = useRuntimeConfig();

  const state = reactive<TClubState>({
    currentClub: null,
    clubs: {
      items: [],
      total_items: 0,
    },
    mapSuggestions: [],
    editPicture: true,
    isRequestLoading: false,
    filters: {
      region: {
        label: '',
        value: '',
      },
      cities: [],
      roomCounts: [],
    },
  });

  const clearCurrentProperty = () => {
    state.currentClub = null;
  };

  const handleRegionCitiesClear = () => {
    if (state.filters.region.value !== '') {
      state.filters.region = { label: '', value: '' };
      state.filters.cities = [];
    }
  };

  const { $api } = useNuxtApp();

  const fetchClubs = async ({
    search,
    page,
    limit,
    sort,
    order,
    clubStatuses,
    authorId,
    updateState = true,
  }: TFetchClubsBody): Promise<TReturnItem<TClub[]>> => {
    try {
      const params: Record<string, string | number | boolean | 'asc' | 'desc' | undefined> = {
        name: search || '',
        limit: limit || 0,
        skip: page && limit ? (page - 1) * limit : 0,
        sort,
        order,
        authorId,
        ...Object.fromEntries(
          Object.entries({
            clubStatuses: clubStatuses,
            roomCounts: state.filters.roomCounts,
            cities: state.filters.cities.map((elem) => elem.value) || [],
          })
            .filter(([_, value]) => value && value.length > 0)
            .map(([key, value]) => [key, value?.join(',')]),
        ),
      };

      if (state.filters.region.value) {
        params.region = state.filters.region.value;
      }

      const response = await $api<TReturnItem<TClub[]>>('/club/all', {
        method: 'GET',
        params,
      });

      if (updateState) {
        state.clubs = response;
      }

      return response;
    } catch {
      if (updateState) {
        state.clubs = {
          items: [],
          total_items: 0,
        };
      }

      return {
        total_items: 0,
        items: [],
      };
    }
  };

  const fetchClubById = async (clubId: string): Promise<TClub | null> => {
    try {
      const response = await $api<TClub>(`/club/${clubId}`);
      state.currentClub = response;

      return response;
    } catch (err) {
      console.log(err, 'ERROR');
      return null;
    }
  };

  const getCoordinatesFromAddress = async (address: string) => {
    try {
      const response = await $fetch<TGeocodeResponse>(
        `https://geocode-maps.yandex.ru/1.x/?geocode=${encodeURIComponent(address)}&format=json&apikey=${config.public.YANDEX_API_KEY || ''}`,
      );

      const geoObject = response.response.GeoObjectCollection.featureMember[0];

      if (geoObject) {
        const [longitude, latitude] = geoObject.GeoObject.Point.pos.split(' ').map((coord) => parseFloat(coord));

        return { latitude, longitude };
      }
    } catch (err) {
      console.log(err, 'ERROR');
      return false;
    }
  };

  const create = async (body: TClubSchema) => {
    const { region, city } = body;

    try {
      state.isRequestLoading = true;
      await $api<TClub>('club/create', {
        method: 'POST',
        body: {
          ...body,
          region: region.value || '',
          city: city.value || '',
        },
      });

      return true;
    } catch (error) {
      console.error('Error while creating:', error);
      return false;
    } finally {
      state.isRequestLoading = false;
    }
  };

  const update = async (body: TClubSchema & { clubId: string; priceDeleteIds: string[] }) => {
    const { clubId, region, city } = body;
    try {
      state.isRequestLoading = true;
      await $api<TClub>(`club/update/${clubId}`, {
        method: 'PATCH',
        body: {
          ...body,
          region: region.value || '',
          city: city.value || '',
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

  //
  // const deleteProperty = async (id: string) => {
  //   try {
  //     state.isRequestLoading = true;
  //     await $api(`property/delete/${id}`, {
  //       method: 'DELETE',
  //     });
  //     return true;
  //   } catch (error) {
  //     console.error('Error while deleting property:', error);
  //     return false;
  //   } finally {
  //     state.isRequestLoading = false;
  //   }
  // };
  //

  return {
    state,
    getCoordinatesFromAddress,
    fetchClubById,
    handleRegionCitiesClear,
    clearCurrentProperty,
    fetchClubs,
    create,
    update,
  };
});
