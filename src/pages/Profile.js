import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!currentUser) {
        navigate('/login');
        return null;
    }
    return (
        <div>
            { currentUser && (
                <div>
                    <h1>Hello, { currentUser.displayName }!</h1>
                    <p>Email: { currentUser.email }</p>
                    <p>Id: { currentUser.uid }</p>

                </div>
            ) }
        </div>
    );
};
export default Profile;