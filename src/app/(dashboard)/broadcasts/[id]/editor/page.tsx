export default async function BroadcastEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#F0F0F0]">
        Broadcast Editor
      </h1>
      <p className="text-[14px] text-[#A1A4A5] mt-2">Broadcast ID: {id}</p>
    </div>
  );
}
