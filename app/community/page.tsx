"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { FacebookEmbed, LinkedInEmbed } from "react-social-media-embed";

// const FacebookEmbed = dynamic(
//     import("react-social-media-embed").then((mod) => mod.FacebookEmbed),
//     { ssr: false }
// );

const CommunityPage = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <div className="p-6 flex flex-col space-y-6">
            <div style={{ display: "flex", justifyContent: "center" }}>
                <FacebookEmbed
                    className="w-full"
                    url="https://www.facebook.com/projectblackgold.sg/posts/pfbid08PNHcipgqX6s45NUYv9DYedhcquwQAZiHedZiJENqZsmowdkZaXvoRjRb5Xc5Lnfl"
                />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <FacebookEmbed
                    className="w-full"
                    url="https://www.facebook.com/habitatcollective.sg/posts/pfbid023vDCkZwLPCx3ayMDakLheLLWuEFELHPQVGs6YkFhwPuoPAuu8AvHH2KdTzYeSZwPl?rdid=z8d3dZTJAnX638P0"
                />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <LinkedInEmbed
                    className="w-full"
                    url="https://www.linkedin.com/embed/feed/update/urn:li:share:7203565661850116096"
                    postUrl="https://www.linkedin.com/posts/cuifenpui_compost-compostmakers-meetup-activity-7203565663011889152-El34?utm_source=share&utm_medium=member_desktop"
                />
            </div>
        </div>
    );
};

export default CommunityPage;
