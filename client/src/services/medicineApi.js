import axios from 'axios';
import { server_url } from '../config/url';

const BASE_URL = server_url + '/medicines';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

export const donateMedicines = async (medicines) => {
  const res = await axios.post(
    `${BASE_URL}/donate`,
    { medicines },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

export const getUserDonations = async () => {
  const res = await axios.get(`${BASE_URL}/dashboard`, {
    headers: getAuthHeaders()
  });
  return res.data;
};

export const getAllMedicines = async () => {
  const res = await axios.get(`${BASE_URL}/all`, {
    headers: getAuthHeaders()
  });
  return res.data;
};
