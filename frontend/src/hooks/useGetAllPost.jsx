import { useDispatch } from 'react-redux';
import { useEffect} from 'react';
import axios from 'axios';
import { setPosts } from '@/redux/postSlice';

const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
               const res = await axios.get('https://streamapp-ufpw.onrender.com/api/v1/post/all', { withCredentials: true });
               if(res?.data.success){
                 dispatch(setPosts(res.data.posts))
               }
            } catch (error) {
                 console.log(error);
            }
        }
        fetchAllPost();
    }, []);
};
export default useGetAllPost;