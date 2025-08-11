
import { useNavigate } from "react-router-dom"
import wastralogo from "../assets/wastralogo.svg"

const Navbar = () => {

    const navigate = useNavigate();
    
  return (
    <div>
        <div>
            <img onClick={() => navigate('/')} className="cursor-pointer h-10" src= {wastralogo} alt="wastra logo" />

            <div>
                <button>Login</button>
            </div>
        </div>
    </div>
  )
}

export default Navbar