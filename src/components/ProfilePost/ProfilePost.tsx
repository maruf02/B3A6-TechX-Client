import ShowPost from "./ShowPost";

interface ProfilePostProps {
  userId: string; // or 'string | null' if it can also be null
}
const ProfilePost: React.FC<ProfilePostProps> = ({ userId }) => {
  console.log("object", userId);
  return (
    <div>
      {/* <h1 className="text-4xl underline text-center py-5">
        Create your Blog Post
      </h1> */}

      {/* for showing all post */}
      <div>
        <ShowPost userId={userId} />
      </div>
    </div>
  );
};

export default ProfilePost;
