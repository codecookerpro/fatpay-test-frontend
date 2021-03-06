import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import web3 from "../Web3";

const LockToken = (props: any) => {
  const dispatch = useDispatch();

  const userAddress = useSelector((state: any) => state.main.userAddress);
  const connected = useSelector((state: any) => state.main.connected);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const work = async () => {
      if(userAddress) {
        try {
          const locked = await props.fatTokenContract?.methods?.isLocked(userAddress).call();
          if(locked != undefined) {
            setLocked(locked);
          }
        } catch(e: any) {
          console.log(e);
        }
      }
    }
    work();
  }, [userAddress, dispatch, props]);

  const handleBtnLockClicked = async () => {
    try {
      await props.fatTokenContract?.methods?.setTokenLocked().send({
        from: userAddress
      });
      alert("Lock Token Success");
      setLocked(true);
    } catch(e: any) {
      console.log(e);
    }
  }

  const handleBtnUnlockClicked = async () => {
    try {
      await props.fatTokenContract?.methods?.unsetTokenLocked().send({
        from: userAddress
      });
      alert("Unlock Token Success");
      setLocked(false);
    } catch(e: any) {
      console.log(e);
    }
  }

  return (
    <div className="card w-full bg-base-100 shadow-xl my-2">
      <div className="card-body">
        <h2 className="card-title">Lock Token here</h2>
        <div className="card-actions justify-end">
          {
            locked ? 
            <button className="btn btn-primary" onClick={handleBtnUnlockClicked} disabled={!connected}>Unlock</button>
            :
            <button className="btn btn-primary" onClick={handleBtnLockClicked} disabled={!connected}>Lock</button>
          }
        </div>
      </div>
    </div>
  )
}

export default LockToken;