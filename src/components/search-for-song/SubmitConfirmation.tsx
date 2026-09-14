"use client";

import Image from "next/image";
import { SongSearchResult } from "@/server/actions/searchActions";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";

interface SubmitConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  favouriteSong?: SongSearchResult;
  onConfirm: () => void;
}

export const SubmitConfirmation = ({
  open,
  onOpenChange,
  favouriteSong,
  onConfirm,
}: SubmitConfirmationProps) => {
  const isMobile = useIsMobile();

  const ConfirmHeader = isMobile ? DrawerHeader : DialogHeader;
  const ConfirmTitle = isMobile ? DrawerTitle : DialogTitle;
  const ConfirmDescription = isMobile ? DrawerDescription : DialogDescription;
  const ConfirmFooter = isMobile ? DrawerFooter : DialogFooter;

  const confirmBody = (
    <>
      {favouriteSong ? (
        <>
          <ConfirmHeader>
            <ConfirmTitle>Lock in top pick</ConfirmTitle>
            <ConfirmDescription>
              This can't be changed once submitted.
            </ConfirmDescription>
          </ConfirmHeader>
          <div className="flex md:flex-col  gap-3 py-2">
            <Image
              className="rounded-lg w-16 h-16 md:w-100 md:h-100"
              src={favouriteSong.albumArt}
              width={200}
              height={200}
              alt={`album art for ${favouriteSong.title}`}
            />
            <div className="flex flex-col">
              <p className="md:text-lg font-semibold">
                {favouriteSong.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {favouriteSong.artist}
              </p>
            </div>
          </div>
        </>
      ) : (
        <ConfirmHeader>
          <ConfirmTitle>Submit without a favourite?</ConfirmTitle>
          <ConfirmDescription>
            You haven't starred a favourite song. You can still submit your 20
            votes, but you won't be eligible for the double-points bonus.
            This can't be changed once submitted.
          </ConfirmDescription>
        </ConfirmHeader>
      )}
      <ConfirmFooter>
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          className="btn-primary cursor-pointer"
          onClick={() => {
            onOpenChange(false);
            onConfirm();
          }}
        >
          Confirm
        </Button>
      </ConfirmFooter>
    </>
  );

  return isMobile ? (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>{confirmBody}</DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>{confirmBody}</DialogContent>
    </Dialog>
  );
};
