import CustomizeVideo from '@/components/landing/customize-video';
import FAQ from '@/components/landing/faq';
import SocialProof from '@/components/landing/social-proof';
import Team from '@/components/landing/team';
import React from 'react';

export default function HomePage() {
    return (
        <React.Fragment>
            <CustomizeVideo />
            <SocialProof />
            <Team />
            <FAQ />
        </React.Fragment >
    );
}