import axios from "../axiosConfig";

export const GetCommentAndrating = async (id: any) => {
    // console.log(id);
    const rs = await axios.get(`/getcommentandrating/${id}`);
    //console.log(rs.data);
    return rs.data;
}

export const PostCommentAndrating = async ( movieId: any, comment: any, rating: any, user: any) => {
    const rs = await axios.post(`/postcommentandrating`, {
        movieId: movieId,
        comment: comment,
        rating: rating,
        user: user
    });
    return rs.data;
}