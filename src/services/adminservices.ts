import axios from "../axiosConfig";


export const getaccount = async () => {
    const res = await axios('/9710010910511011297103101/account');
    console.log(res.data);
    return res.data;
}