import { createServer, Model } from "miragejs";

import badgeIcon from "@src/assets/svgs/badge.svg";
import buttonsIcon from "@src/assets/svgs/buttons.svg";
import followersIcon from "@src/assets/svgs/followers.svg";
import ConnectIcon from "@src/assets/svgs/green_Btn.svg";
import messageIcon from "@src/assets/svgs/message.svg";
import profileIcon from "@src/assets/svgs/profilepic.svg";
import sampleIcon from "@src/assets/svgs/sampleimg.svg";
import SystemIcon from "@src/assets/svgs/system.svg";
import ThreeDots from "@src/assets/svgs/three-dots.svg";

export function makeServer({ environment }) {
  const work_data = {
    All: {
      systems: [
        {
          id: "1",
          system_title: "Ge Signa Excite",
          system_subtiltle: "GE Healthcare",
          system_image: SystemIcon,
          connect_image: ConnectIcon,
        },
        {
          id: "2",
          system_title: "AirisMate 0.2T",
          system_subtiltle: "Hitachi",
          system_image: SystemIcon,
          connect_image: ConnectIcon,
        },
        {
          id: "3",
          system_title: "Espree 1.5T",
          system_subtiltle: "Siemens",
          system_image: SystemIcon,
          connect_image: ConnectIcon,
        },
        {
          id: "4",
          system_title: "Signa Excite",
          system_subtiltle: "GE Healthcare",
          system_image: SystemIcon,
          connect_image: ConnectIcon,
        },
        {
          id: "5",
          system_title: "Et Signa Excite",
          system_subtiltle: "GE Healthcare",
          system_image: SystemIcon,
          connect_image: ConnectIcon,
        },
      ],
    },
    MRI: {},
    ULTRASOUND: {},
    MEMMOGRAPH: {},
  };
  const users = [
    {
      id: "1",
      user_name: "AbdullahShah Jane",
      health_network: "Advent Health",
      unionImage: ThreeDots,
      status: false,
    },
    {
      id: "2",
      user_name: "Ali Jane",
      health_network: "Advent Health",
      unionImage: ThreeDots,
      status: true,
    },
    {
      id: "3",
      user_name: "AbdullahShah Jane",
      health_network: "Advent Health",
      unionImage: ThreeDots,
      status: false,
    },
    {
      id: "4",
      user_name: "Coady Jane",
      health_network: "Advent Health",
      unionImage: ThreeDots,
      status: true,
    },
    {
      id: "4",
      user_name: "Fared Jane",
      health_network: "Advent Health",
      unionImage: ThreeDots,
      status: false,
    },
    {
      id: "5",
      user_name: "Isra Jane",
      health_network: "Advent Health",
      unionImage: ThreeDots,
      status: true,
    },
    {
      id: "6",
      user_name: "Asad Jane",
      health_network: "Advent Health",
      unionImage: ThreeDots,
      status: false,
    },
  ];
  const timeline_info = [
    {
      card_text:
        "I am currently applying for a Clinical Specialist position with Medtronic and am curious if there are any current Clinical Specialists that could tell me a little bit more about their role? The recruiter I spoke with said that the job is more of a lifestyle in that you are essentially on call to go to clinics between 7 a.m. and 6 p.m. and...",
      card_text_title: "Clinical Specialist for MedTronics",
      followers_text: "24 followers",
      message_text: "142",
      ultra_image: badgeIcon,
      follower_btn: buttonsIcon,
      message_icon: messageIcon,
      followers_icon: followersIcon,
      profile_icon: profileIcon,
      user_name: "Alex Jacobs",
      post_time: "3 hours ago",
      sample_icon: sampleIcon,
    },
    {
      card_text:
        "I am currently applying for a Clinical Specialist position with Medtronic and am curious if there are any current Clinical Specialists that could tell me a little bit more about their role? The recruiter I spoke with said that the job is more of a lifestyle in that you are essentially on call to go to clinics between 7 a.m. and 6 p.m. and...",
      card_text_title: "Clinical Specialist for MedTronics",
      followers_text: "24 followers",
      message_text: "142",
      device_number: "2,220",
      ultra_image: badgeIcon,
      follower_btn: buttonsIcon,
      message_icon: messageIcon,
      followers_icon: followersIcon,
      profile_icon: profileIcon,
      user_name: "Alex Jacobs",
      post_time: "3 hours ago",
      sample_icon: sampleIcon,
    },
    {
      card_text:
        "I am currently applying for a Clinical Specialist position with Medtronic and am curious if there are any current Clinical Specialists that could tell me a little bit more about their role? The recruiter I spoke with said that the job is more of a lifestyle in that you are essentially on call to go to clinics between 7 a.m. and 6 p.m. and...",
      card_text_title: "Clinical Specialist for MedTronics",
      followers_text: "24 followers",
      message_text: "142",
      ultra_image: badgeIcon,
      follower_btn: buttonsIcon,
      message_icon: messageIcon,
      followers_icon: followersIcon,
      profile_icon: profileIcon,
      user_name: "Alex Jacobs",
      post_time: "3 hours ago",
      sample_icon: sampleIcon,
    },
    {
      card_text:
        "I am currently applying for a Clinical Specialist position with Medtronic and am curious if there are any current Clinical Specialists that could tell me a little bit more about their role? The recruiter I spoke with said that the job is more of a lifestyle in that you are essentially on call to go to clinics between 7 a.m. and 6 p.m. and...",
      card_text_title: "Clinical Specialist for MedTronics",
      followers_text: "24 followers",
      message_text: "142",
      ultra_image: badgeIcon,
      follower_btn: buttonsIcon,
      message_icon: messageIcon,
      followers_icon: followersIcon,
      profile_icon: profileIcon,
      user_name: "Alex Jacobs",
      post_time: "3 hours ago",
      sample_icon: sampleIcon,
    },
  ];

  const recent_activities = [
    {
      id: 1,
      name: "David Krager",
      activity: "started following your activity",
      time: "3 hours ago",
    },
    {
      id: 2,
      name: "David Krager",
      activity: "commented on topic you follow",
      time: "4 hours ago",
    },
    {
      id: 3,
      name: "David Degea",
      activity: "commented on topic you follow",
      time: "5 hours ago",
    },
    {
      id: 4,
      name: "David Degea",
      activity: "commented on topic you follow",
      time: "5 hours ago",
    },
    {
      id: 5,
      name: "David Degea",
      activity: "commented on topic you follow",
      time: "5 hours ago",
    },
  ];
  return createServer({
    environment,
    models: {
      user: Model,
    },
    routes() {
      this.namespace = "/";
      this.logging = false;
      this.get("/api/mockusers", () => {
        return users;
      });
      this.get("/api/mockorders", () => {
        return work_data;
      });
      this.get("/api/mockuserposts", () => {
        return timeline_info;
      });
      this.get("/api/mockrecentactivity", () => {
        return recent_activities;
      });

      this.passthrough("https://vfse.s3-us-east-2.amazonaws.com");
      this.passthrough();
    },
  });
}
