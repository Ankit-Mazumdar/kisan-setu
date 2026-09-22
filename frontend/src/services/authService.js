import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const SESSION_KEY = 'kisansetu_session';

const TOKEN_KEY = 'kisansetu_token';


// ===============================
// REGISTER FARMER
// ===============================

export async function registerFarmer({
  fullName,
  mobile,
  email,
  password,
  address,
  village,
  district,
  state,
  aadhaarNo,
  farmerGovtId,
  bankName,
  bankAccountNo,
}) {

  try {

    const { data } = await api.post('/register/', {

      full_name: fullName,

      phone: mobile,

      // Email is optional
      email: email || null,

      password: password,

      address: address || null,

      village: village || null,

      district: district || null,

      state: state || null,

      aadhaar_no: aadhaarNo || null,

      farmer_govt_id: farmerGovtId || null,

      bank_name: bankName || null,

      bank_account_no: bankAccountNo || null,

    });


    return {

      fullName:
        data.farmer.full_name,

      phone:
        data.farmer.phone,

      email:
        data.farmer.email,

      farmerId:
        data.farmer.farmer_id,

      address:
        data.farmer.address,

      village:
        data.farmer.village,

      district:
        data.farmer.district,

      state:
        data.farmer.state,

    };

  } catch (error) {

    if (
      error.response &&
      error.response.data
    ) {

      const backendError =
        error.response.data;


      if (backendError.email) {

        throw new Error(
          'This email is already registered.'
        );

      }


      if (backendError.phone) {

        throw new Error(
          'This mobile number is already registered.'
        );

      }


      if (backendError.aadhaar_no) {

        throw new Error(
          'This Aadhaar number is already registered.'
        );

      }


      if (backendError.farmer_govt_id) {

        throw new Error(
          'This Government ID is already registered.'
        );

      }


      throw new Error(
        'Registration failed. Please check your details.'
      );

    }


    throw new Error(
      'Unable to connect to the server. Please try again.'
    );

  }

}


// ===============================
// LOGIN FARMER
// ===============================

export async function loginFarmer({
  identifier,
  password,
}) {

  try {

    const { data } = await api.post(
      '/login/',
      {
        identifier: identifier,
        password: password,
      }
    );


    const session = {

      farmerId:
        data.farmer.farmer_id,

      fullName:
        data.farmer.full_name,

      phone:
        data.farmer.phone,

      email:
        data.farmer.email,

      address:
        data.farmer.address,

      village:
        data.farmer.village,

      district:
        data.farmer.district,

      state:
        data.farmer.state,

    };


    // Save farmer session

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session)
    );


    return {
      farmer: session,
    };

  } catch (error) {

    if (
      error.response &&
      error.response.data
    ) {

      throw new Error(
        error.response.data.message ||
        'Invalid email/mobile number or password.'
      );

    }


    throw new Error(
      'Unable to connect to the server. Please try again.'
    );

  }

}


// ===============================
// LOGOUT
// ===============================

export function logoutFarmer() {

  localStorage.removeItem(
    SESSION_KEY
  );

  localStorage.removeItem(
    TOKEN_KEY
  );

}


// ===============================
// GET CURRENT FARMER
// ===============================

export function getCurrentFarmer() {

  const session =
    localStorage.getItem(
      SESSION_KEY
    );

  return session
    ? JSON.parse(session)
    : null;

}

export async function getFarmerProfile(farmerId) {

  try {

    const { data } = await api.get(
      `/farmer/${farmerId}/`
    );

    return data;

  } catch (error) {

    if (
      error.response &&
      error.response.data
    ) {

      throw new Error(
        error.response.data.message ||
        'Unable to load farmer profile.'
      );

    }

    throw new Error(
      'Unable to connect to the server. Please try again.'
    );

  }

}

// ===============================
// UPDATE FARMER PROFILE
// ===============================

export async function updateFarmerProfile(
  farmerId,
  profileData
) {

  try {

    const { data } = await api.put(
      `/farmer/${farmerId}/update/`,
      {

        full_name:
          profileData.fullName,

        phone:
          profileData.phone,

        email:
          profileData.email || null,

        address:
          profileData.address || null,

        village:
          profileData.village || null,

        district:
          profileData.district || null,

        state:
          profileData.state || null,

        aadhaar_no:
          profileData.aadhaarNo || null,

        farmer_govt_id:
          profileData.farmerGovtId || null,

        bank_name:
          profileData.bankName || null,

        bank_account_no:
          profileData.bankAccountNo || null

      }
    );


    return data.farmer;


  } catch (error) {

    if (
      error.response &&
      error.response.data
    ) {

      throw new Error(
        error.response.data.message ||
        'Unable to update farmer profile.'
      );

    }


    throw new Error(
      'Unable to connect to the server. Please try again.'
    );

  }

}


export default api;