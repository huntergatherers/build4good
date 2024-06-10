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
                    url="https://www.facebook.com/andrewismusic/posts/pfbid021RBJeV6E9auoW6qmj4m7KRiS73fqPTDwwCEX55SpZ9QEu7FXQ6s6b183miNyFEQBl"
                />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <LinkedInEmbed
                    className="w-full"
                    url="https://www.linkedin.com/embed/feed/update/urn:li:share:6898694772484112384"
                    postUrl="https://www.linkedin.com/posts/peterdiamandis_5-discoveries-the-james-webb-telescope-will-activity-6898694773406875648-z-D7"
                />
            </div>
        </div>
    );
};

export default CommunityPage;
