import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import web3 from "../Web3";

const ProtectToken = (props: any) => {
  const dispatch = useDispatch();

  const userAddress = useSelector((state: any) => state.main.userAddress);
  const connected = useSelector((state: any) => state.main.connected);
  const [isProtected, setProtected] = useState(false);

  useEffect(() => {
    const work = async () => {
      if(userAddress) {
        try {
          const isProtected = await props.fatTokenContract?.methods?.isProtected(userAddress).call();
          if(isProtected != undefined) {
            setProtected(isProtected);
          }
        } catch(e: any) {
          console.log(e);
        }
      }
    }
    work();
  }, [userAddress, dispatch, props]);

  const handleBtnProtectClicked = async () => {
    try {
      await props.fatTokenContract?.methods?.enableProtection().send({
        from: userAddress
      });
      alert("Lock Token Success");
      setProtected(true);
    } catch(e: any) {
      console.log(e);
    }
  }

  const handleBtnUnprotectClicked = async () => {
    try {
      await props.fatTokenContract?.methods?.disableProtection(userAddress).send({
        from: userAddress
      });
      alert("Unlock Token Success");
      setProtected(false);
    } catch(e: any) {
      console.log(e);
    }
  }

  return (
    <div className="card w-full bg-base-100 shadow-xl my-2">
      <div className="card-body">
        <h2 className="card-title">Protect Token here</h2>
        <div className="card-actions justify-end">
          {
            isProtected ? 
            <button className="btn btn-primary" onClick={handleBtnUnprotectClicked} disabled={!connected}>Disable Protection</button>
            :
            <button className="btn btn-primary" onClick={handleBtnProtectClicked} disabled={!connected}>Enable Protection</button>
          }
        </div>
      </div>
    </div>
  )
}

export default ProtectToken;