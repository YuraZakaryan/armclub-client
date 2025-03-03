import type { TClub, TClubState, TFetchClubsBody, TGeocodeResponse, TReturnItem } from '~/types';
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
    updateState = true,
  }: TFetchClubsBody): Promise<TReturnItem<TClub[]>> => {
    try {
      const params: Record<string, string | number | boolean | 'asc' | 'desc' | undefined> = {
        title: search || '',
        limit: limit || 0,
        skip: page && limit ? (page - 1) * limit : 0,
        sort,
        order,
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

      const response = await $api<TReturnItem<TClub[]>>('/property/all', {
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

  const fetchPropertyById = async (propertyId: string): Promise<TClub | null> => {
    try {
      const response = await $api<TClub>(`/club/${propertyId}`);
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

  // const create = async (body: TPropertySchema & { authorId: string }) => {
  //   const {
  //     authorId,
  //     category,
  //     region,
  //     city,
  //     state: propertyState,
  //     buildingType,
  //     balconyType,
  //     viewOf,
  //     mainCurrency,
  //     amenities,
  //   } = body;
  //
  //   try {
  //     state.isRequestLoading = true;
  //     await $api<TProperty>('property/create', {
  //       method: 'POST',
  //       body: {
  //         ...body,
  //         category: category.value || '',
  //         region: region.value || '',
  //         city: city.value || '',
  //         state: propertyState?.value || '',
  //         balconyType: balconyType?.value?.toLowerCase() || '',
  //         viewOf: viewOf?.value?.toLowerCase() || '',
  //         amenities: amenities?.map((amenity) => amenity?.value) || [],
  //         buildingType: buildingType?.value || '',
  //         mainCurrency: mainCurrency?.value === 'do_not_choose' ? '' : (mainCurrency?.value ?? ''),
  //         author: authorId,
  //       },
  //     });
  //
  //     return true;
  //   } catch (error) {
  //     console.error('Error while creating:', error);
  //     return false;
  //   } finally {
  //     state.isRequestLoading = false;
  //   }
  // };
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
  // const update = async (body: TPropertySchema & { propId: string }) => {
  //   const {
  //     propId,
  //     category,
  //     region,
  //     city,
  //     state: propState,
  //     balconyType,
  //     viewOf,
  //     buildingType,
  //     mainCurrency,
  //     amenities,
  //   } = body;
  //   try {
  //     state.isRequestLoading = true;
  //     await $api<TProperty>(`property/update/${propId}`, {
  //       method: 'PATCH',
  //       body: {
  //         ...body,
  //         category: category.value || '',
  //         region: region.value || '',
  //         city: city.value || '',
  //         state: propState?.value || '',
  //         balconyType: balconyType?.value?.toLowerCase() || '',
  //         viewOf: viewOf?.value?.toLowerCase() || '',
  //         amenities: amenities?.map((amenity) => amenity?.value) || [],
  //         buildingType: buildingType?.value || '',
  //         mainCurrency: mainCurrency?.value === EPropertyMainCurrency.DO_NOT_CHOOSE ? '' : (mainCurrency?.value ?? ''),
  //       },
  //     });
  //
  //     return true;
  //   } catch (error) {
  //     console.error('Error while updating:', error);
  //     return false;
  //   } finally {
  //     state.isRequestLoading = false;
  //   }
  // };

  return {
    state,
    getCoordinatesFromAddress,
    fetchProperties,
    fetchPropertyById,
    handleRegionCitiesClear,
    clearCurrentProperty,
    // create,
    // update,
    // deleteProperty,
  };
});
