import {Module} from '@changke/staticnext-lib';

export default class Example extends Module {
  colorMods_: string[];
  counter_: number;
  colorCode_: string;

  static attachTo(root: Element): Example {
    return new Example(root);
  }

  constructor(root: Element) {
    super(root);
    this.name_ = 'example';
    this.colorMods_ = ['r', 'g', 'b'];
    this.counter_ = -1;
    this.colorCode_ = '';
  }

  start(): void {
    this.root_.addEventListener('click', () => {
      this.update();
    });
  }

  update(): void {
    const oldClass = this.colorClass_(this.counter_);
    const newClass = this.colorClass_(++this.counter_);
    if (oldClass) {
      this.root_.classList.remove(oldClass);
    }
    this.log('Updating color...');
    this.root_.classList.add(newClass);
    this.publish('example:colorChanged', {color: this.colorCode_});
  }

  colorClass_(i: number): string {
    if (i < 0) {
      return '';
    }
    const mod = this.colorMods_[i % this.colorMods_.length];
    this.colorCode_ = mod;
    return `rgb-sq__${mod}`;
  }
}
