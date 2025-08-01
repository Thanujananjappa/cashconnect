import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

export const updateUserLocation = async (
  userId: string,
  latitude: number,
  longitude: number
): Promise<any> => {
  try {
    const response = await axios.patch(`${BACKEND_URL}/api/users/${userId}/location`, {
      latitude,
      longitude,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Axios error while updating user location:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Server error');
    } else {
      console.error('❌ Unexpected error:', error);
      throw new Error('Unexpected error occurred');
    }
  }
};
