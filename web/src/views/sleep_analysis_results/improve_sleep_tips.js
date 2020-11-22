import BadgeBulletPoint from 'components/badge_bullet_point';
import React from 'react';

const TipsToImproveSleep = () => (
  <>
    <p>In order to improve your sleep hygiene, many elements can be considered:</p>
    <ul className="list-unstyled mt-4">
      <li className="py-2">
        <h6 className="mb-0">
          <BadgeBulletPoint badgeColor="warning" iconClass="fas fa-coffee fa-sm">
            Alimentation: having a balanced diet and avoiding sources of caffeine can have a positive impact on one’s
            sleep. Chocolate, soft drink, tea and decaffeinated coffee are unexpected sources of caffeine.
          </BadgeBulletPoint>
        </h6>
      </li>
      <li className="py-2">
        <BadgeBulletPoint badgeColor="warning" iconClass="far fa-calendar-alt">
          <h6 className="mb-0">
            Routine: going to sleep at about the same time, in a darkened and quiet environment can help stabilize your
            sleep internal mechanisms, namely your circadian rhythms and your homeostasis.
          </h6>
        </BadgeBulletPoint>
      </li>
      <li className="py-2">
        <BadgeBulletPoint badgeColor="warning" iconClass="fas fa-lightbulb">
          <h6 className="mb-0">
            Light: avoid looking at screens before or while getting to bed. Light, especially blue wavelenghts, suppress
            melatonin secretion, thus interfering with your circadian rhythms.
          </h6>
        </BadgeBulletPoint>
      </li>

      <li className="py-2">
        <BadgeBulletPoint badgeColor="warning" iconClass="fas fa-running">
          <h6 className="mb-0">Exercise: work out for 20 to 30 minutes each day.</h6>
        </BadgeBulletPoint>
      </li>
    </ul>
  </>
);

export default TipsToImproveSleep;
