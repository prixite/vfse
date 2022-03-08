import ProfileTimeline from "@src/components/common/Smart/ProfileTimeline/ProfileTimeline";
import TopicUpdatesSection from "@src/components/common/Smart/TopicUpdatesSection/TopicUpdatesSection";
import VfseTopSection from "@src/components/common/Smart/VfseTopSection/VfseTopSection";
import { localizedData } from "@src/helpers/utils/language";
import "@src/components/common/Smart/ForumSection/ForumSection.scss";

const { forum, title } = localizedData().Forum;
export default function ForumSection() {
  return (
    <div className="ForumSection">
      <h2 className="heading" style={{ marginBottom: "32px" }}>
        {forum}
      </h2>
      <VfseTopSection />
      <TopicUpdatesSection title={title} seeAll="" />
      <ProfileTimeline />
    </div>
  );
}
