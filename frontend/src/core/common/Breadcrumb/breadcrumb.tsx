import React from 'react';
import { all_routes } from '../../../feature-module/router/all_routes';
import { Link } from 'react-router-dom';


interface BreadcrumbProps {
    title: string;
}


const Breadcrumb: React.FC<BreadcrumbProps> = ({ title }) => {

    return (
        <>
        {/* Breadcrumb */}
            <div className="breadcrumb-bar text-center">
                <div className="container">
                <div className="row">
                    <div className="col-md-12 col-12">
                    <h2 className="breadcrumb-title mb-2">{title}</h2>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item">
                            <Link to={all_routes.homeone}>Home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {title}
                        </li>
                        </ol>
                    </nav>
                    </div>
                </div>
            </div>
        </div>
        {/* /Breadcrumb */}
        </>
    );
};

export default Breadcrumb;
