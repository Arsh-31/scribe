type FolderItemProps = {
  name: string;
};

export const FolderItem = ({ name }: FolderItemProps) => {
  return (
    <div className="px-4 py-2 rounded bg-[#F8F5FF] border border-[#A68CB0] shadow-sm">
      {name}
    </div>
  );
};
