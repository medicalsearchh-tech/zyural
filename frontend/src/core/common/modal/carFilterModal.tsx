import { Slider } from 'antd'
import type { SliderSingleProps } from 'antd';
import { Link } from 'react-router-dom';
const CarFilterModal = () => {
    const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value) => `$${value}`;
  return (
    <>
     {/* Filter Modal */}
     <div className="modal fade" id="filter_modal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
                <div className="modal-header d-flex align-items-center justify-content-between">
                    <h4>Filters</h4>
                    <Link to="#" className="text-primary">Clear</Link>
                </div>
                <form >
                    <div className="modal-body">
                        <div className="mb-3">
                            <div className="d-flex align-items-center mb-2 pb-2">
                                <span className="me-2"><i className="isax isax-coin text-primary"></i></span>
                                <h6>Price Per Day</h6>
                            </div>
                            <div className="mt-4">
                                <div className="filter-range">
                                    <Slider range tooltip={{ formatter }}  min={200} max={5695} defaultValue={[500, 2000]}  />
                                </div>
                                <div className="filter-range-amount">
                                    <p className="fs-14">Range : <span className="text-gray-9 fw-medium">$200 - $800</span></p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="d-flex align-items-center mb-3">
                                <span className="me-2"><i className="isax isax-car text-primary"></i></span>
                                <h6>Car Brands</h6>
                            </div>
                            <div className="d-flex align-items-center flex-wrap row-gap-2">
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-1" /> 
                                    <label className="form-check-label ms-2" htmlFor="hotel-1">
                                        Toyota
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-2" /> 
                                    <label className="form-check-label ms-2" htmlFor="hotel-2">
                                        Ford
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-3" /> 
                                    <label className="form-check-label ms-2" htmlFor="hotel-3">
                                        Honda
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-4" defaultChecked /> 
                                    <label className="form-check-label ms-2" htmlFor="hotel-4">
                                        BMW
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-5" /> 
                                    <label className="form-check-label ms-2" htmlFor="hotel-5">
                                        Mercedes-Benz
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-6" /> 
                                    <label className="form-check-label ms-2" htmlFor="hotel-6">
                                        Tesla
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-7" /> 
                                    <label className="form-check-label ms-2" htmlFor="hotel-7">
                                        Audi
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-8" /> 
                                    <label className="form-check-label ms-2" htmlFor="hotel-8">
                                        Chevrolet
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="d-flex align-items-center mb-3">
                                <span className="me-2"><i className="isax isax-smart-car text-primary"></i></span>
                                <h6>Car Type</h6>
                            </div>
                            <div className="d-flex align-items-center flex-wrap row-gap-2">
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="amenities-1" /> 
                                    <label className="form-check-label ms-2" htmlFor="amenities-1">
                                        Sedan
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="amenities-2" /> 
                                    <label className="form-check-label ms-2" htmlFor="amenities-2">
                                        EV
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="amenities-3" /> 
                                    <label className="form-check-label ms-2" htmlFor="amenities-3">
                                        Crossover
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="amenities-4" /> 
                                    <label className="form-check-label ms-2" htmlFor="amenities-4">
                                        Sports
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="amenities-5" /> 
                                    <label className="form-check-label ms-2" htmlFor="amenities-5">
                                        Van
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="amenities-6" /> 
                                    <label className="form-check-label ms-2" htmlFor="amenities-6">
                                        Wagon
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="amenities-7" /> 
                                    <label className="form-check-label ms-2" htmlFor="amenities-7">
                                        SUV
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="amenities-8" /> 
                                    <label className="form-check-label ms-2" htmlFor="amenities-8">
                                        Convertible
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="d-flex align-items-center mb-3">
                                <span className="me-2"><i className="isax isax-gas-station text-primary"></i></span>
                                <h6>Fuel</h6>
                            </div>
                            <div className="d-flex align-items-center flex-wrap row-gap-2">
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="fuel-1" /> 
                                    <label className="form-check-label ms-2" htmlFor="fuel-1">
                                        Petrol
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="fuel-2" /> 
                                    <label className="form-check-label ms-2" htmlFor="fuel-2">
                                        Diesel
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="fuel-3" /> 
                                    <label className="form-check-label ms-2" htmlFor="fuel-3">
                                        Hybrid
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="fuel-4" /> 
                                    <label className="form-check-label ms-2" htmlFor="fuel-4">
                                        CNG
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="fuel-5" /> 
                                    <label className="form-check-label ms-2" htmlFor="fuel-5">
                                        EV
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="d-flex align-items-center mb-3">
                                <span className="me-2"><i className="isax isax-kanban text-primary"></i></span>
                                <h6>Gear</h6>
                            </div>
                            <div className="d-flex align-items-center flex-wrap row-gap-2">
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="gear-1" /> 
                                    <label className="form-check-label ms-2" htmlFor="gear-1">
                                        Manual
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="gear-2" /> 
                                    <label className="form-check-label ms-2" htmlFor="gear-2">
                                        Auto
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="gear-3" /> 
                                    <label className="form-check-label ms-2" htmlFor="gear-3">
                                        Hybrid
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="d-flex align-items-center mb-3">
                                <span className="me-2"><i className="isax isax-tag-user text-primary"></i></span>
                                <h6>Capacity</h6>
                            </div>
                            <div className="d-flex align-items-center flex-wrap row-gap-2">
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="seat-1" /> 
                                    <label className="form-check-label ms-2" htmlFor="seat-1">
                                        2 Seater
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="seat-2" /> 
                                    <label className="form-check-label ms-2" htmlFor="seat-2">
                                        4 Seater
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="seat-3" /> 
                                    <label className="form-check-label ms-2" htmlFor="seat-3">
                                        5 Seater
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="seat-4" /> 
                                    <label className="form-check-label ms-2" htmlFor="seat-4">
                                        7 Seater
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="d-flex align-items-center mb-3">
                                <span className="me-2"><i className="isax isax-routing-2 text-primary"></i></span>
                                <h6>Travelled</h6>
                            </div>
                            <div>
                                <div className="filter-range">
                                    <Slider range  min={100} max={2000} defaultValue={[500, 800]}  />
                                </div>
                                <div className="filter-range-amount">
                                    <p className="fs-14">Range : <span className="text-gray-9 fw-medium">10000 Km - 20000 Km</span></p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="d-flex align-items-center mb-3">
                                <span className="me-2"><i className="isax isax-building text-primary"></i></span>
                                <h6>Reviews</h6>
                            </div>
                            <div className="d-flex align-items-center flex-wrap row-gap-2">
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="star1" /> 
                                    <label className="form-check-label ms-2" htmlFor="star1">
                                        <i className="fas fa-star filled text-primary"></i>
                                        <i className="fas fa-star filled text-primary"></i>
                                        <i className="fas fa-star filled text-primary"></i>
                                        <i className="fas fa-star filled text-primary"></i>
                                        <i className="fas fa-star filled text-primary"></i>
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="star2" /> 
                                    <label className="form-check-label ms-2" htmlFor="star2">
                                        <i className="fas fa-star filled text-primary"></i>
                                        <i className="fas fa-star filled text-primary"></i>
                                        <i className="fas fa-star filled text-primary"></i>
                                        <i className="fas fa-star filled text-primary"></i>
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="star3" /> 
                                    <label className="form-check-label ms-2" htmlFor="star3">
                                        <i className="fas fa-star filled text-primary"></i>
                                        <i className="fas fa-star filled text-primary"></i>
                                        <i className="fas fa-star filled text-primary"></i>
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="star4" /> 
                                    <label className="form-check-label ms-2" htmlFor="star4">
                                        <i className="fas fa-star filled text-primary"></i>
                                        <i className="fas fa-star filled text-primary"></i>
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="star5" /> 
                                    <label className="form-check-label ms-2" htmlFor="star5">
                                        <i className="fas fa-star filled text-primary"></i>
                                    </label>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="d-flex align-items-center justify-content-end m-0">
                            <button type="button" className="btn btn-light me-2" data-bs-dismiss="modal">Reset</button>
                            <button type="button" data-bs-dismiss="modal" className="btn btn-primary">Apply Filters</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    {/* Filter Modal */}
    </>
  )
}

export default CarFilterModal