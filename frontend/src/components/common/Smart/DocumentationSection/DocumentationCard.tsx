import React from "react";

import EditLogo from "@src/assets/svgs/Edit.svg";
import "@src/components/common/Smart/DocumentationSection/DocumentationCard.scss";
interface DocumentationCardProp {
  doc: {
    id: number;
    product_id: number;
    name: string;
    manufacturer: string;
    modality: string;
    documentation: string;
    model: string;
  };
  documentationLink: (link: any) => JSX.Element;
  openDropDown: (event: any, id: any, name: any) => void;
}
const DocumentationCard = ({
  doc,
  documentationLink,
  openDropDown,
}: DocumentationCardProp) => {
  return (
    <div className="DocumentationCard">
      <div className="system">
        <h3 className="name">{doc?.model}</h3>
        <img
          src={EditLogo}
          onClick={(e) => openDropDown(e, doc?.id, doc?.name)}
        />
      </div>
      <div className="manufacturer">
        <h3 className="name">MANUFACTURER</h3>
        <p className="name">{doc?.manufacturer}</p>
      </div>
      <div className="modality">
        <div className="modality__item">{doc?.modality}</div>
      </div>
      <div className="documentation">
        {documentationLink(doc?.documentation)}
      </div>
    </div>
  );
};

export default DocumentationCard;
