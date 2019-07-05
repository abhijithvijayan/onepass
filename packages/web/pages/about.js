import React, { Component } from 'react';
import { Layout } from 'antd';

import BodyWrapper from '../components/BodyWrapper';

class AboutPage extends Component {
    render() {
        return (
            <BodyWrapper>
                <Layout className="layout">
                    <div>About Page</div>
                </Layout>
            </BodyWrapper>
        );
    }
}

export default AboutPage;
