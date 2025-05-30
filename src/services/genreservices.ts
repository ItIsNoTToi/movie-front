import axios from "../axiosConfig";

export const fetchGenres = async () => {
    try{
        const res = await axios.get('/9710010910511011297103101/getGenre');
        // console.log(res.data);
        return res.data;
    } catch (err){
        console.log(err);
    }
};