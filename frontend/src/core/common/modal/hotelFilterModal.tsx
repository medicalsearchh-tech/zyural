import { Link } from 'react-router-dom'
import { Slider } from 'antd'
import type { SliderSingleProps } from 'antd';

const HotelFilterModal = () => {
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
                        <div className=" mb-3">
                            <div className="d-flex align-items-center mb-2">
                                <span className="me-2"><i className="isax isax-ranking text-primary"></i></span>
                                <h6>Popular</h6>
                            </div>
                            <div className="d-flex align-items-center flex-wrap">
                                <div className="form-checkbox form-check form-check-inline d-inline-flex align-items-center mt-2 me-2">
                                    <input className="form-check-input ms-0 mt-0" name="popular1" type="checkbox" id="popular1" defaultChecked />
                                    <label className="form-check-label ms-2" htmlFor="popular1">
                                        Breakfast Included
                                    </label>
                                </div>
                                <div className="form-checkbox form-check form-check-inline d-inline-flex align-items-center mt-2 me-2">
                                    <input className="form-check-input ms-0 mt-0" name="popular2" type="checkbox" id="popular2" />
                                    <label className="form-check-label ms-2" htmlFor="popular2">
                                        Budget
                                    </label>
                                </div>
                                <div className="form-checkbox form-check form-check-inline d-inline-flex align-items-center mt-2 me-2">
                                    <input className="form-check-input ms-0 mt-0" name="popular3" type="checkbox" id="popular3" />
                                    <label className="form-check-label ms-2" htmlFor="popular3">
                                        4 Star Hotels
                                    </label>
                                </div>
                                <div className="form-checkbox form-check form-check-inline d-inline-flex align-items-center mt-2 me-2">
                                    <input className="form-check-input ms-0 mt-0" name="popular4" type="checkbox" id="popular4" />
                                    <label className="form-check-label ms-2" htmlFor="popular4">
                                        5 Star Hotels
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="d-flex align-items-center mb-2 pb-2">
                                <span className="me-2"><i className="isax isax-coin text-primary"></i></span>
                                <h6>Price Per Night</h6>
                            </div>
                            <div className="mt-4">
                                <div className="filter-range">
                                    <Slider range tooltip={{ formatter }}  min={0} max={1000} defaultValue={[200, 800]}  />
                                </div>
                                <div className="filter-range-amount">
                                    <p className="fs-14">Range : <span className="text-gray-9 fw-medium">$200 - $5695</span></p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="d-flex align-items-center mb-3">
                                <span className="me-2"><i className="isax isax-buildings text-primary"></i></span>
                                <h6>Hotel Types</h6>
                            </div>
                            <div className="d-flex align-items-center flex-wrap row-gap-2">
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-1" />
                                    <label className="form-check-label ms-2" htmlFor="hotel-1">
                                        Hotels
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-2" />
                                    <label className="form-check-label ms-2" htmlFor="hotel-2">
                                        Aparthotel
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-3" />
                                    <label className="form-check-label ms-2" htmlFor="hotel-3">
                                        Villa
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-4" />
                                    <label className="form-check-label ms-2" htmlFor="hotel-4">
                                        Apartment
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-5" />
                                    <label className="form-check-label ms-2" htmlFor="hotel-5">
                                        Private Vacation Home
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-6" />
                                    <label className="form-check-label ms-2" htmlFor="hotel-6">
                                        Guest House
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-7" />
                                    <label className="form-check-label ms-2" htmlFor="hotel-7">
                                        Lodge
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="hotel-8" />
                                    <label className="form-check-label ms-2" htmlFor="hotel-8">
                                        Resort
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="d-flex align-items-center mb-3">
                                <span className="me-2"><i className="isax isax-candle text-primary"></i></span>
                                <h6>Amenities</h6>
                            </div>
                            <div className="d-flex align-items-center flex-wrap row-gap-2">
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="amenities-1" />
                                    <label className="form-check-label ms-2" htmlFor="amenities-1">
                                        Free Wifi
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="amenities-2" />
                                    <label className="form-check-label ms-2" htmlFor="amenities-2">
                                        Breakfast Included
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="amenities-3" />
                                    <label className="form-check-label ms-2" htmlFor="amenities-3">
                                        Pool
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="amenities-4" />
                                    <label className="form-check-label ms-2" htmlFor="amenities-4">
                                        Free Parking
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="d-flex align-items-center mb-3">
                                <span className="me-2"><i className="isax isax-maximize text-primary"></i></span>
                                <h6>Distance</h6>
                            </div>
                            <div>
                                <span className="d-block mb-2">25 KM</span>
                                <div className="filter-range">
                                    <Slider  max={100} defaultValue={20}  />
                                </div>
                            </div>
                            <div className="d-flex align-items-center flex-wrap row-gap-2">
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="loc-1" />
                                    <label className="form-check-label ms-2" htmlFor="loc-1">
                                        Central Park
                                    </label>
                                </div>
                                <div className="form-check d-flex align-items-center ps-0 me-4">
                                    <input className="form-check-input ms-0 mt-0" type="checkbox" id="loc-2" />
                                    <label className="form-check-label ms-2" htmlFor="loc-2">
                                        The Metropolitan Museum of Art
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="d-flex align-items-center justify-content-end m-0">
                            <button type="button" className="btn btn-light btn-md me-2" data-bs-dismiss="modal">Reset</button>
                            <button type="button" data-bs-dismiss="modal" className="btn btn-primary btn-md">Apply Filters</button>
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

export default HotelFilterModal