import React from 'react';
import notfound from '../../assets/img/notfound.svg'
import { NavLink } from 'react-router-dom';

const NotFoundIcon = (props) => {
    return (
        <svg
            className="mr-2 -ml-1 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
            ></path>
        </svg>
    );
}

const PageNotFound = () => {
    return (
        <>
            <div className="flex flex-col justify-center items-center px-6 mx-auto h-screen xl:px-0">
                <div className="block md:max-w-lg">
                    <img src={notfound} alt="astronaut image" />
                </div>
                <div className="text-center xl:max-w-4xl">
                    <h1 className="mb-3 text-2xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl ">Página no encontrada</h1>
                    <p className="mb-5 text-base font-normal text-gray-500 md:text-lg ">
                        ¡Ups! Parece que seguiste un enlace incorrecto. Si cree que esto es un problema con nosotros, díganoslo.
                    </p>
                    <NavLink
                        to="/"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-3"
                    >
                        <NotFoundIcon />
                        Volver a casa
                    </NavLink>
                </div>
            </div >
        </>
    )
}

export default PageNotFound
