import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useDispatch, useSelector } from 'react-redux';
import {  openSharedCollModal } from '../redux/noteSlice';
import AddSharedCollModal from './AddSharedCollModal';

function SharedCollectionAddBtn() {

  const sharedCollModal = useSelector(
    (state: any) => state.note.sharedCollModal
  );

  const dispatch = useDispatch()

    const handleClick =()=>{
        dispatch(openSharedCollModal())
    }

  return (
    <div className='w-full bg-white'>
      <div onClick={handleClick} className='cursor-pointer w-[300px] flex flex-col items-center justify-center gap-2 rounded-lg  h-[200px] border-2 border-gray-400 hover:bg-slate-200 transition-all'>
      <AddRoundedIcon className='!text-5xl' />
      <span className='text-[20px] font-bold text-center'>Make a Shared Collection</span>
      </div>

      {sharedCollModal && <AddSharedCollModal />}
    </div>
  )
}

export default SharedCollectionAddBtn
