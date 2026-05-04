import { Button } from "@workspace/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { ArrowRight } from "lucide-react";
import React from "react";

export function TryHaya() {
  const [url, setUrl] = React.useState("");

  return (
    <section className="section" id="try">
      <div className="container">
        <div className="try">
          <div className="try-inner">
            <div className="section-eyebrow">03 · Try it now</div>
            <h3 className="font-inter mb-2 text-balance">
              Audit any live URL in <em>under 12 seconds.</em>
            </h3>
            <p>No signup. No install. Drop a link, watch Haya tear it apart.</p>

            <InputGroup className="h-auto">
              <InputGroupInput
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <InputGroupAddon align="inline-end">
                <Button size="lg">
                  Run audit
                  <ArrowRight />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
