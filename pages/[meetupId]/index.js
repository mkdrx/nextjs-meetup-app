import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";

import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetails = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description}></meta>
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
};

// Required for getStaticProps - for dynamic pages
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://USER:PASSWORD@cluster0.fqnj1qe.mongodb.net/meetupsDatabase?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  // .find({})  - the second argument is for which field/s to extract
  // returns all meetups / all documents
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  // Close db connection
  client.close();

  // Once we get the meetups, its going to be used to map it to get the array of paths
  // Setting fallback to true(returns empty page) or blocking(user won't see anything until page is served) will make that Vercel
  // doesn't show a 404 if the page can't be found immediately
  return {
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // Fetch data (meetup id) for a single meetup
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://USER:PASSWORD@cluster0.fqnj1qe.mongodb.net/meetupsDatabase?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  // .findOne finds one set single document
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
