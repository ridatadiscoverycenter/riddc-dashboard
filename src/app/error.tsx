"use client";

import React from "react";

import { Button, Card, ExternalLink, FullBleedColumn, Header, Modal } from "@/components";

export default function RhodeIslandBuoyDataError({ error }: { error: Error }) {
  const [showStackTrace, setShowStackTrace] = React.useState(false);
  return (
    <FullBleedColumn className="w-full mt-10">
      <Card className="bg-white/80 dark:bg-white/10 w-full">
        <Header tag="h1" size="md">Oh No! An Error as occured.</Header>
        <pre className="bg-white/90 dark:bg-white/10 rounded-md p-2">{error.message}</pre>
        <Button onClick={() => setShowStackTrace((currentValue) => !currentValue)}>View Stack Trace</Button>
        <Modal open={showStackTrace} setOpen={setShowStackTrace}>
          <div className="font-mono  max-w-80 max-h-80 overflow-scroll">
            {(error.stack || "").split("\n").map((errorLine) => (<p key={errorLine}>{errorLine}</p>))}
          </div>
        </Modal>
        <p>If the problem persists, contact <ExternalLink href="mailto:support@ccv.brown.edu">CCV Support</ExternalLink> with the issue!</p>
      </Card>
    </FullBleedColumn>
  );
}
