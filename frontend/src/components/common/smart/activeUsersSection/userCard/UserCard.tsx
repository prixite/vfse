import "@src/components/common/smart/activeUsersSection/userCard/userCard.scss";
import { User } from "@src/store/reducers/api";
interface UserCardProps {
  user: User;
  handleClick: (event: unknown, id: number, active: boolean) => void;
}
const ActiveUserCard = ({ user }: UserCardProps) => {
  return (
    <div className="UserCard">
      <div className="user">
        <h3 className="name">{`${user?.first_name} ${user?.last_name}`}</h3>
      </div>
      <div className="userInfo">
        <h3 className="name">Status</h3>
        <p className="name" style={user?.is_active ? {} : { color: "red" }}>
          {user?.is_active ? "Active" : "Locked"}
        </p>
      </div>
    </div>
  );
};

export default ActiveUserCard;
