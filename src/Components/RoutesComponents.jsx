import { Routes, Route } from 'react-router-dom';
import PublicRoute from './routes/PublicRoute';
import Login from '../Pages/Login';
import RegisterSeller from '../Pages/RegisterSeller';
import AdminRoute from './routes/AdminRoute';
import User from '../Pages/User.';
import Products from '../Pages/Products';
import Order from '../Pages/Order';
import Notification from '../Pages/Notification';
import SellerRoute from './routes/SellerRoute';
import Home from '../Pages/Home';
import Profiles from '../Pages/Profiles';
import Account from '../Pages/Account';
import Support from '../Pages/Support';
import Combos from '../Pages/Combos';
import Course from '../Pages/Course';
import License from '../Pages/License';
import OrderClient from '../Pages/View-client/OrderClient';
import MyProfile from '../Pages/View-client/MyProfile';


const RoutesComponents = () => {
    return (
        <div>
            <Routes>
                <Route path='/login' element={<PublicRoute />}>
                    <Route index element={<Login />} />
                </Route>

                <Route path='/register-sellers' element={<PublicRoute />}>
                    <Route index element={<RegisterSeller />} />
                </Route>

                <Route path='/' element={<AdminRoute />}>
                    <Route path='/users' element={<User />} />
                    <Route path='/products' element={<Products />} />
                    <Route path='/orders' element={<Order />} />
                    <Route path='/notifications' element={<Notification />} />
                </Route>



                <Route path='/' element={<SellerRoute />} >
                    <Route index element={<Home />} />
                    <Route path="/myprofile" element={<MyProfile />} />
                    <Route path="/profiles" element={<Profiles />} />
                    <Route path="/accounts" element={<Account />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/combos" element={<Combos />} />
                    <Route path="/courses" element={<Course />} />
                    <Route path="/licenses" element={<License />} />
                    <Route path="/orders-client" element={<OrderClient />} />
                </Route>
            </Routes>
        </div>
    );
};

export default RoutesComponents;

