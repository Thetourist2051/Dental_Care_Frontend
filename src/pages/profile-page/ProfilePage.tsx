import { memo, useEffect } from "react";
import { useLocation } from "react-router";

const ProfilePage: React.FC = memo(() => {
  const location = useLocation();
  useEffect(() => {
    console.log(location.state, "location.state");
  }, [location]);
  return <>Profile Page {location.state}</>;
});

export default ProfilePage;
