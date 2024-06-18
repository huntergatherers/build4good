"use client";
import ListingVerticalScroll from "@/components/listing-vertical-scroll";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { FacebookEmbed, LinkedInEmbed } from "react-social-media-embed";
import MapPage from "../map/page";
import { createDummyData } from "@/lib/dummy";


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
    // const handleCreateDummyData = async () => {
    //     try {
    //         await createDummyData();
    //         alert('Dummy data created successfully');
    //     } catch (error) {
    //         console.error('Error creating dummy data:', error);
    //         alert('Failed to create dummy data');
    //     }
    // };

    return (
        <div className="relative w-screen">
            <Tabs defaultValue="Community Map" className="w-full">
            <TabsList className="fixed top-0 z-10 align-middle self-center w-full flex justify-center py-6">
            <TabsTrigger className="w-44" value="Community Map">
                        Community Map
                    </TabsTrigger>
                    <TabsTrigger className=" w-44" value="Forum">
                        Forum
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="Community Map">
                    <MapPage />
                </TabsContent>
                <TabsContent value="Forum" className="mt-14">
                    <div className="p-6 flex flex-col space-y-6 z-10">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <FacebookEmbed
                                className="w-full h-80 z-0"
                                url="https://www.facebook.com/projectblackgold.sg/posts/pfbid08PNHcipgqX6s45NUYv9DYedhcquwQAZiHedZiJENqZsmowdkZaXvoRjRb5Xc5Lnfl"
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <FacebookEmbed
                                className="w-full h-fit z-0"
                                url="https://www.facebook.com/habitatcollective.sg/posts/pfbid023vDCkZwLPCx3ayMDakLheLLWuEFELHPQVGs6YkFhwPuoPAuu8AvHH2KdTzYeSZwPl?rdid=z8d3dZTJAnX638P0"
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <LinkedInEmbed
                                className="w-full h-fit z-0"
                                url="https://www.linkedin.com/embed/feed/update/urn:li:share:7203565661850116096"
                                postUrl="https://www.linkedin.com/posts/cuifenpui_compost-compostmakers-meetup-activity-7203565663011889152-El34?utm_source=share&utm_medium=member_desktop"
                            />
                        </div>
                        {/* <button
                            onClick={handleCreateDummyData}
                            className="mt-4 p-2 bg-blue-500 text-white rounded"
                        >
                            Create Dummy Data
                        </button> */}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CommunityPage;
