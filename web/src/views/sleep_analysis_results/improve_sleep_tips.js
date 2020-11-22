import BadgeBulletPoint from 'components/badge_bullet_point';
import React from 'react';

const TipsToImproveSleep = () => (
  <>
    <p className="lead mt-8">
      Sleep deficiency increases the risk of health disorders like high blood pressure, cardiovascular disease,
      diabetes, depression and obesity. It can also have huge side effects such as a decrease in mental capabilities
      like learning, decision making process and problem-solving skills. Sleep deficiency is often caused by sleep
      deprivation but can also be due to other factors like out of sync sleep (going to bed out of sync with your
      circadian rythm) and getting poor sleep quality (which may be a symptom of sleep disorders such as sleep apnea or
      restless legs syndrome). In order to improve your sleep hygiene and get a better and longer sleep, many actions
      should be considered:
    </p>
    <ul className="list-unstyled mt-4">
      <li className="py-2">
        <h6 className="mb-0">
          <BadgeBulletPoint badgeColor="warning" iconClass="fas fa-coffee fa-sm">
            Alimentation: avoid eating large meals before bedtime. Having a balanced diet and avoiding sources of
            caffeine can have a positive impact on one’s sleep. Chocolate, soft drink, tea and decaffeinated coffee are
            unexpected sources of caffeine.
          </BadgeBulletPoint>
        </h6>
      </li>
      <li className="py-2">
        <h6 className="mb-0">
          <BadgeBulletPoint badgeColor="warning" iconClass="fas fa-wine-glass-alt fa-sm">
            Alcohol, drugs and medicines: just as caffeine influences sleep, the consumption of alcohol, drugs and
            certain medications have a significant effect on it. Alcohol, for example, reduces significantly the amount
            of REM sleep and lead to multiple awakenings throughout each sleep cycle. [Shrivastava and al., 2014]
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
