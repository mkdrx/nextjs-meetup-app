import { Fragment } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>NextJS Meetups</title>
        <meta
          name="description"
          content="Browse a list of meetups using NextJS and MongoDB"
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// Runs for every request - should just use getServerSideProps if req object is needed and/or if data changes multiple times every second
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

// If data fetching is needed before pre-render - runs during build process - never runs in client side
// if we expect that the data changes more frequently we can add another property to the return object: revalidate: number in seconds
// then this page won't just be generated on the build process, it will also be generated every x seconds on the server if there are requests for this page
export async function getStaticProps() {
  // Connect to db to fetch data
  const client = await MongoClient.connect(
    "mongodb+srv://USER:PASSWORD@cluster0.fqnj1qe.mongodb.net/meetupsDatabase?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

export default HomePage;
