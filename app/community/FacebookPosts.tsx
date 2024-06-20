'use client';
import { FacebookEmbed, LinkedInEmbed } from 'react-social-media-embed';

export default function FaceBookPosts() {
  return (
    <div className="p-6 flex flex-col space-y-4 z-10">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <FacebookEmbed
          className="w-full h-fit z-0"
          url="https://www.facebook.com/projectblackgold.sg/posts/pfbid08PNHcipgqX6s45NUYv9DYedhcquwQAZiHedZiJENqZsmowdkZaXvoRjRb5Xc5Lnfl"
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <FacebookEmbed
          className="w-full h-fit z-0"
          url="https://www.facebook.com/habitatcollective.sg/posts/pfbid023vDCkZwLPCx3ayMDakLheLLWuEFELHPQVGs6YkFhwPuoPAuu8AvHH2KdTzYeSZwPl?rdid=z8d3dZTJAnX638P0"
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
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
  );
}
