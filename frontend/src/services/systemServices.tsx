import { toast } from "react-toastify";

const addNewOrdanizationSystem = async (
  organizationId,
  systemObject,
  addOrganizationSystem,
  refetch,
  handleClear,
  setDisableButton
) => {
  await addOrganizationSystem({
    id: organizationId,
    system: systemObject,
  })
    .unwrap()
    .then(() => {
      toast.success("System Successfully Added", {
        autoClose: 1000,
        pauseOnHover: false,
        onClose: () => {
          handleClear();
          setDisableButton(false);
          refetch();
        },
      });
    });
};

const updateOrdanizationSystem = async (
  organizationId,
  id,
  system,
  updateSystem,
  refetch,
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
      toast.success("System Successfully Updated", {
        autoClose: 1000,
        pauseOnHover: false,
        onClose: () => {
          handleClear();
          setDisableButton(false);
          refetch();
        },
      });
    });
};

const DeleteOrganizationSystemService = async (
  organizationId,
  systemId,
  deleteSystemsOrganization,
  refetch
) => {
  await deleteSystemsOrganization({
    id: organizationId,
    systemPk: systemId,
  }).unwrap();
  refetch(); // TODO: invalidate cache instead of this.
};
const addNewSystemNoteService = async (
  authorID,
  systemID,
  note,
  addNewNote,
  refetch
) => {
  await addNewNote({
    id: systemID,
    systemNotes: { author: authorID, note },
  })
    .unwrap()
    .then(() => {
      refetch();
    });
};
const deleteSystemNoteService = async (NoteId, deleteNote, refetchNote) => {
  await deleteNote({
    id: NoteId,
  }).then(() => {
    toast.success("Comment Deleted Successfully", {
      autoClose: 1000,
      pauseOnHover: false,
    });
    refetchNote();
  });
};
const updateSystemNoteService = async (
  NoteId,
  note,
  updateNote,
  refetchNote
) => {
  await updateNote({
    id: NoteId,
    noteSerialier: { note },
  })
    .unwrap()
    .then(() => {
      toast.success("Comment Updated Successfully", {
        autoClose: 1000,
        pauseOnHover: false,
      });
      refetchNote();
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
