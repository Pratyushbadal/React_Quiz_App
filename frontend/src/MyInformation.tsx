function MyInformation({
  name,
  email,
  profilePicture,
}: {
  id: string;
  name: string;
  email?: string;
  profilePicture?: string;
}) {
  return (
    <div>
      {profilePicture ? (
        <img src={`http://localhost:3000/${profilePicture}`} alt={name} />
      ) : (
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#eee",
            margin: "0 auto 1rem",
          }}
        />
      )}
      <p>
        <strong>{name}</strong>
      </p>
      {email && <p>{email}</p>}
    </div>
  );
}

export default MyInformation;
