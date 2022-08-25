import { toast } from "react-toastify";
import { timeOut } from "@src/helpers/utils/constants";


const addNewOrdanizationSystem = async (
  organizationId,
  systemObject,
  addOrganizationSystem,
  handleClear,
  setDisableButton
) => {
  await addOrganizationSystem({
    id: organizationId,
    system: systemObject,
  })
    .unwrap()
    .then(() => {
      toast.success("System Successfully Added.", {
        autoClose: timeOut,
        pauseOnHover: false,
        onClose: () => {
          handleClear();
          setDisableButton(false);
        },
      });
    });
};

const updateOrdanizationSystem = async (
  organizationId,
  id,
  system,
  updateSystem,
  handleClear,
  setDisableButton
) => {
  const OrganizationsSystemsPartialUpdateApiArg = {
    id: organizationId,
    systemPk: id,
    system: system,
  };
  await updateSystem(OrganizationsSystemsPartialUpdateApiArg)
    .unwrap()
    .then(() => {
      toast.success("System Successfully Updated.", {
        autoClose: timeOut,
        pauseOnHover: false,
        onClose: () => {
          handleClear();
          setDisableButton(false);
        },
      });
    });
};

const DeleteOrganizationSystemService = async (
  organizationId,
  systemId,
  deleteSystemsOrganization
) => {
  await deleteSystemsOrganization({
    id: organizationId,
    systemPk: systemId,
  }).unwrap();
};
const addNewSystemNoteService = async (
  authorID,
  systemID,
  note,
  addNewNote
) => {
  await addNewNote({
    id: systemID,
    systemNotes: { author: authorID, note },
  }).unwrap();
};
const deleteSystemNoteService = async (NoteId, deleteNote) => {
  await deleteNote({
    id: NoteId,
  }).then(() => {
    toast.success("Comment deleted successfully.", {
      autoClose: timeOut,
      pauseOnHover: false,
    });
  });
};
const updateSystemNoteService = async (NoteId, note, updateNote) => {
  await updateNote({
    id: NoteId,
    noteSerialier: { note },
  })
    .unwrap()
    .then(() => {
      toast.success("Comment updated successfully.", {
        autoClose: timeOut,
        pauseOnHover: false,
      });
    });
};
export {
  addNewOrdanizationSystem,
  updateOrdanizationSystem,
  DeleteOrganizationSystemService,
  addNewSystemNoteService,
  deleteSystemNoteService,
  updateSystemNoteService,
};
