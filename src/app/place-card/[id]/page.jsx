import PlaceCardViewModal from "./PlaceCardViewModal";

export default async function PlaceCardViewModalPage({ params }) {
  const { id } = await params

  return <PlaceCardViewModal placeId={id} />;
}
