import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import web3 from "../Web3";

const LockToken = (props: any) => {
  const dispatch = useDispatch();
  const [period, setPeriod] = useState<string>("");

  const userAddress = useSelector((state: any) => state.main.userAddress);
  const connected = useSelector((state: any) => state.main.connected);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const work = async () => {
      if(userAddress) {
        try {
          const lockPeriod = await props.fatTokenContract?.methods?.getLockPeriod(userAddress).call();
          if(lockPeriod > 0) {
            setLocked(true);
            setPeriod(lockPeriod);
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
      await props.fatTokenContract?.methods?.setTokenLocked(period).send({
        from: userAddress
      });
      alert("Lock Token Success");
    } catch(e: any) {
      console.log(e);
    }
  }

  const handleBtnUnlockClicked = async () => {
    try {
      await props.fatTokenContract?.methods?.unsetTokenLocked(userAddress).send({
        from: userAddress
      });
      alert("Unlock Token Success");
    } catch(e: any) {
      console.log(e);
    }
  }

  const handleInputAmountChanged = (event: any) => {
    setPeriod(event.target.value);
  }

  return (
    <div className="card w-full bg-base-100 shadow-xl my-2">
      <div className="card-body">
        <h2 className="card-title">Lock Token here</h2>
        {
          locked ? 
            <div className="card-title">Lock Period: {period}</div>
          : 
            <input type="text" placeholder="Input period in secs" className="input input-bordered w-full" onChange={handleInputAmountChanged} />
          
        }
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