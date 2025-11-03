import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import CountUp from "react-countup";
import { useInView } from 'react-intersection-observer';

const Counter = () => {

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <>
      {/* counter */}
      <section className="counter-sec"  ref={ref}>
        <div className="container">
          <div className="row gy-3">
            <div className="col-xl-3 col-md-6">
              <div className="card border-0 mb-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="counter-icon">
                      <ImageWithBasePath
                        src="./assets/img/icons/counter-icon1.svg"
                        alt="img"
                      />
                    </div>
                    <div className="count-content">
                      <h4 className="text-info">
                        <span className="count-digit">
                          <CountUp
                            end={inView ? 750 : 0}
                            duration={10}
                            separator=","
                            decimals={0}
                            containerProps={{ 
                            className: "count-digit" 
                          }}
                        />
                        </span>
                      </h4>
                      <p>Online Courses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card border-0 mb-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="counter-icon">
                      <ImageWithBasePath
                        src="./assets/img/icons/counter-icon2.svg"
                        alt="img"
                      />
                    </div>
                    <div className="count-content">
                      <h4 className="text-warning">
                        <span className="count-digit"><CountUp
                            end={inView ? 150 : 0}
                            duration={10}
                            separator=","
                            decimals={0}
                            containerProps={{ 
                            className: "count-digit" 
                          }}
                        /></span> +
                      </h4>
                      <p>Expert Tutors</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card border-0 mb-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="counter-icon">
                      <ImageWithBasePath
                        src="./assets/img/icons/counter-icon3.svg"
                        alt="img"
                      />
                    </div>
                    <div className="count-content">
                      <h4 className="text-skyblue">
                        <span className="count-digit"><CountUp
                            end={inView ? 700 : 0}
                            duration={10}
                            separator=","
                            decimals={0}
                            containerProps={{ 
                            className: "count-digit" 
                          }}
                        /></span> +
                      </h4>
                      <p>Certified Courses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card border-0 mb-0">
                <div className="card-body d-flex align-items-center">
                  <div className="counter-icon">
                    <ImageWithBasePath
                      src="./assets/img/icons/counter-icon4.svg"
                      alt="img"
                    />
                  </div>
                  <div className="count-content">
                    <h4 className="text-lightgreen">
                      <span className="count-digit"><CountUp
                            end={inView ? 1700 : 0}
                            duration={10}
                            separator=","
                            decimals={0}
                            containerProps={{ 
                            className: "count-digit" 
                          }}
                        /></span> +
                    </h4>
                    <p>Online Students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* counter */}
    </>
  );
};

export default Counter;
