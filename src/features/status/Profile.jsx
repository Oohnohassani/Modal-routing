function Profile({ userImg }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 via-pink-500 to-purple-600">
      <div className="flex h-13 w-13 cursor-pointer items-center justify-center overflow-hidden rounded-full">
        <img src={userImg} alt="" />
      </div>
    </div>
  );
}

export default Profile;
