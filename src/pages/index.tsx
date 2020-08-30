import Link from "next/link";
import { CurrentTimeEntry } from "@/components/CurrentTimeEntry";
import { PresetList } from "@/components/PresetList";
import { useStoreState } from "@/store/context";

export default function Index() {
  const { apiToken } = useStoreState();

  return (
    <>
      <h1>Home</h1>
      {apiToken === "" ? (
        <p>
          Not setting API Token. Please set from{" "}
          <Link href="/settings">
            <a>settings</a>
          </Link>{" "}
          page
        </p>
      ) : (
        <>
          <CurrentTimeEntry />
          <PresetList />
        </>
      )}
      <p>
        <Link href="/settings">
          <a>Settings</a>
        </Link>
      </p>
    </>
  );
}
