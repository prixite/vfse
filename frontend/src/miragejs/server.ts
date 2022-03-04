import { createServer, Model } from "miragejs";

import ConnectIcon from "@src/assets/svgs/Green_Btn.svg";
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
  return createServer({
    environment,
    models: {
      user: Model,
    },
    routes() {
      this.namespace = "/";
      this.get("/api/mockusers", () => {
        return users;
      });
      this.get("/api/mockorders", () => {
        return work_data;
      });
      this.passthrough("https://vfse.s3-us-east-2.amazonaws.com");
      this.passthrough();
    },
  });
}
