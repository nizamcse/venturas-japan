import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Car from './pages/Car';
import City from './pages/City';
import User from './pages/User';
import MapView from './pages/MapView';
import CreateCity from './pages/CreateCity';
import CreateUser from './pages/CreateUser';
import CreateCar from './pages/CreateCar';
import Report from './pages/Report';
import AdminLayout from './layouts/AdminLayout';
import AdminPrivateRoute from './middleware/AdminPrivateRoute';
import OperatorLayout from './layouts/OperatorLayout';
import OperatorCar from './pages/OperatorCars';
import TrackingOperator from './pages/TrackingOperator';

const Main = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route
                    index
                    element={
                        <AdminPrivateRoute>
                            <City />
                        </AdminPrivateRoute>
                    }
                />
                <Route
                    path="cars"
                    element={
                        <AdminPrivateRoute>
                            <Car />
                        </AdminPrivateRoute>
                    }
                />
                <Route
                    path="users"
                    element={
                        <AdminPrivateRoute>
                            <User />
                        </AdminPrivateRoute>
                    }
                />
                <Route
                    path="tracking"
                    element={
                        <AdminPrivateRoute>
                            <MapView />
                        </AdminPrivateRoute>
                    }
                />
                <Route
                    path="reports"
                    element={
                        <AdminPrivateRoute>
                            <Report />
                        </AdminPrivateRoute>
                    }
                />
                <Route
                    path="create-car"
                    element={
                        <AdminPrivateRoute>
                            <CreateCar />
                        </AdminPrivateRoute>
                    }
                />
                <Route
                    path="edit-city/:id"
                    element={
                        <AdminPrivateRoute>
                            <CreateCity />
                        </AdminPrivateRoute>
                    }
                />
                <Route
                    path="create-city"
                    element={
                        <AdminPrivateRoute>
                            <CreateCity />
                        </AdminPrivateRoute>
                    }
                />
                <Route
                    path="create-user"
                    element={
                        <AdminPrivateRoute>
                            <CreateUser />
                        </AdminPrivateRoute>
                    }
                />
                <Route
                    path="edit-car/:id"
                    element={
                        <AdminPrivateRoute>
                            <CreateCar />
                        </AdminPrivateRoute>
                    }
                />
                <Route
                    path="edit-user/:id"
                    element={
                        <AdminPrivateRoute>
                            <CreateUser />
                        </AdminPrivateRoute>
                    }
                />
            </Route>
            <Route path="/my-account" element={<OperatorLayout />}>
                <Route
                    index
                    element={
                        <AdminPrivateRoute>
                            <OperatorCar />
                        </AdminPrivateRoute>
                    }
                />
                <Route
                    path="tracking"
                    element={
                        <AdminPrivateRoute>
                            <TrackingOperator />
                        </AdminPrivateRoute>
                    }
                />
            </Route>
            <Route path="/tracking-map" element={<TrackingOperator />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default Main;
