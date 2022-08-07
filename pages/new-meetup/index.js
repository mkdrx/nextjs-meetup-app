// our-domain.com/new-meetup

import NewMeetupForm from "../../components/meetups/NewMeetupForm";

function NewMeetupPage() {
  // Add meetup handler
  const addMeetupHandler = (enteredMeetupData) => {
    console.log(enteredMeetupData);
  };

  return <NewMeetupForm onAddMeetup={addMeetupHandler} />;
}

export default NewMeetupPage;
