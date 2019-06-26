import React, { Component } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

class LoginCarousel extends Component {
    render() {
        return (
            <Carousel showArrows={false} showStatus={false} showThumbs={false} infiniteLoop autoPlay>
                <div>
                    <img
                        alt="img1"
                        src="https://images.pexels.com/photos/2234000/pexels-photo-2234000.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                    />
                </div>
                <div>
                    <img
                        alt="img2"
                        src="https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?cs=srgb&dl=architecture-auto-automobiles-210182.jpg&fm=jpg"
                    />
                </div>
                <div>
                    <img
                        alt="img3"
                        src="https://images.pexels.com/photos/450035/pexels-photo-450035.jpeg?cs=srgb&dl=connection-contemporary-data-450035.jpg&fm=jpg"
                    />
                </div>
            </Carousel>
        );
    }
}

export default LoginCarousel;
