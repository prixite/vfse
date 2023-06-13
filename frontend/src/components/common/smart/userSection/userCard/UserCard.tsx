import { useTranslation } from "react-i18next";

import EditLogo from "@src/assets/svgs/edit.svg";
import "@src/components/common/smart/userSection/userCard/userCard.scss";
import { User } from "@src/store/reducers/api";
interface UserCardProps {
  user: User;
  handleClick: (event: unknown, id: number, active: boolean) => void;
}
const UserCard = ({ user, handleClick }: UserCardProps) => {
  const { t } = useTranslation();
  return (
    <div className="UserCard">
      <div className="user">
        <h3 className="name">{`${user?.first_name} ${user?.last_name}`}</h3>
        <img
          src={EditLogo}
          onClick={(e) => handleClick(e, user?.id, user?.is_active)}
        />
      </div>
      <div className="userInfo">
        <h3 className="name">{t("Email")}</h3>
        <p className="name">{user?.email}</p>
      </div>
      <div className="userInfo">
        <h3 className="name">{t("Customer")}</h3>
        <p className="name">{user?.organizations}</p>
      </div>
      <div className="userInfo">
        <h3 className="name">{t("Status")}</h3>
        <p className="name" style={user?.is_active ? {} : { color: "red" }}>
          {user?.is_active ? "Active" : "Locked"}
        </p>
      </div>
      <div className="modality">
        {user.modalities.map((modality, key) => (
          <div className="modality__item" key={key}>
            {modality}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCard;
